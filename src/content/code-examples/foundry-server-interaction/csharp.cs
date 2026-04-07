using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

// 連接 Foundry 上啟動的 FHIR Server 並執行基本操作
// 預設使用 FHIR Candle（本地 Foundry 部署）
class FoundryFhirClient
{
    private static readonly HttpClient client = new HttpClient();
    private const string FHIR_BASE = "http://localhost:8080/fhir/r4";

    static async Task Main(string[] args)
    {
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/fhir+json"));

        await GetCapabilityStatement();
        var patientId = await CreatePatient();
        await CreateBloodPressure(patientId);
        await SearchPatients("王");
        await ValidatePatient();
    }

    // 1. 取得伺服器能力聲明
    static async Task GetCapabilityStatement()
    {
        var response = await client.GetAsync($"{FHIR_BASE}/metadata");
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(content);
        var root = doc.RootElement;
        Console.WriteLine($"Server: {root.GetProperty("software").GetProperty("name").GetString()}");
        Console.WriteLine($"FHIR Version: {root.GetProperty("fhirVersion").GetString()}");
    }

    // 2. 建立 Patient
    static async Task<string> CreatePatient()
    {
        var patient = new
        {
            resourceType = "Patient",
            name = new[] { new { family = "王", given = new[] { "小明" }, use = "official" } },
            gender = "male",
            birthDate = "1990-05-15",
            identifier = new[] { new { system = "http://example.org/mrn", value = "MRN-001" } }
        };

        var json = JsonSerializer.Serialize(patient);
        var content = new StringContent(json, Encoding.UTF8, "application/fhir+json");
        var response = await client.PostAsync($"{FHIR_BASE}/Patient", content);
        response.EnsureSuccessStatusCode();

        var responseBody = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(responseBody);
        var id = doc.RootElement.GetProperty("id").GetString() ?? "";
        Console.WriteLine($"Created Patient ID: {id}");
        return id;
    }

    // 3. 依姓名搜尋 Patient
    static async Task SearchPatients(string family)
    {
        var response = await client.GetAsync($"{FHIR_BASE}/Patient?family={Uri.EscapeDataString(family)}");
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(content);
        if (doc.RootElement.TryGetProperty("total", out var total))
            Console.WriteLine($"Found {total} patients with family name '{family}'");
    }

    // 4. 建立血壓 Observation
    static async Task CreateBloodPressure(string patientId)
    {
        var obs = new
        {
            resourceType = "Observation",
            status = "final",
            code = new
            {
                coding = new[] { new { system = "http://loinc.org", code = "55284-4", display = "Blood pressure systolic and diastolic" } }
            },
            subject = new { reference = $"Patient/{patientId}" },
            effectiveDateTime = DateTime.UtcNow.ToString("o"),
            component = new[]
            {
                new
                {
                    code = new { coding = new[] { new { system = "http://loinc.org", code = "8480-6", display = "Systolic blood pressure" } } },
                    valueQuantity = new { value = 120, unit = "mmHg", system = "http://unitsofmeasure.org", code = "mm[Hg]" }
                },
                new
                {
                    code = new { coding = new[] { new { system = "http://loinc.org", code = "8462-4", display = "Diastolic blood pressure" } } },
                    valueQuantity = new { value = 80, unit = "mmHg", system = "http://unitsofmeasure.org", code = "mm[Hg]" }
                }
            }
        };

        var json = JsonSerializer.Serialize(obs);
        var content = new StringContent(json, Encoding.UTF8, "application/fhir+json");
        var response = await client.PostAsync($"{FHIR_BASE}/Observation", content);
        response.EnsureSuccessStatusCode();
        Console.WriteLine("Created blood pressure Observation");
    }

    // 5. 驗證 Resource
    static async Task ValidatePatient()
    {
        var patient = new
        {
            resourceType = "Patient",
            gender = "male",
            birthDate = "1990-05-15",
            name = new[] { new { family = "王", use = "official" } }
        };

        var json = JsonSerializer.Serialize(patient);
        var content = new StringContent(json, Encoding.UTF8, "application/fhir+json");
        var response = await client.PostAsync($"{FHIR_BASE}/Patient/$validate", content);
        var responseBody = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(responseBody);

        bool hasError = false;
        if (doc.RootElement.TryGetProperty("issue", out var issues))
        {
            foreach (var issue in issues.EnumerateArray())
            {
                if (issue.TryGetProperty("severity", out var sev) && sev.GetString() == "error")
                {
                    Console.WriteLine($"❌ Validation error: {issue.GetProperty("diagnostics").GetString()}");
                    hasError = true;
                }
            }
        }
        if (!hasError) Console.WriteLine("✅ Validation passed");
    }
}
