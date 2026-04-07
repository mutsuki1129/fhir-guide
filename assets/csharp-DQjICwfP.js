var e=`// 使用 C# HttpClient 建立 FHIR R4 Patient 資源
// NuGet: dotnet add package System.Text.Json

using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

class FhirPatientExample
{
    private static readonly HttpClient client = new HttpClient();
    private const string BaseUrl = "https://hapi.fhir.org/baseR4";

    static async Task Main(string[] args)
    {
        // 建立 Patient
        var patient = await CreatePatient();
        Console.WriteLine($"Patient created, ID: {patient.GetProperty("id").GetString()}");

        // 讀取 Patient
        var id = patient.GetProperty("id").GetString();
        var fetched = await GetPatient(id!);
        var name = fetched.GetProperty("name")[0].GetProperty("text").GetString();
        Console.WriteLine($"Patient name: {name}");

        // 搜尋 Patient
        await SearchPatients("王");
    }

    static async Task<JsonElement> CreatePatient()
    {
        var patientData = new
        {
            resourceType = "Patient",
            text = new
            {
                status = "generated",
                div = "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">王大明</div>"
            },
            identifier = new[]
            {
                new { use = "official", system = "https://www.nhi.gov.tw", value = "A123456789" }
            },
            name = new[]
            {
                new { use = "official", text = "王大明", family = "王", given = new[] { "大明" } }
            },
            telecom = new[]
            {
                new { system = "phone", value = "0912345678", use = "mobile" }
            },
            gender = "male",
            birthDate = "1985-03-15",
            address = new[]
            {
                new { use = "home", city = "台北市", country = "TW" }
            }
        };

        var json = JsonSerializer.Serialize(patientData);
        var content = new StringContent(json, Encoding.UTF8, "application/fhir+json");
        content.Headers.ContentType = new MediaTypeHeaderValue("application/fhir+json");

        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/fhir+json"));

        var response = await client.PostAsync($"{BaseUrl}/Patient", content);
        response.EnsureSuccessStatusCode();

        var responseBody = await response.Content.ReadAsStringAsync();
        return JsonDocument.Parse(responseBody).RootElement;
    }

    static async Task<JsonElement> GetPatient(string id)
    {
        var response = await client.GetAsync($"{BaseUrl}/Patient/{id}");
        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadAsStringAsync();
        return JsonDocument.Parse(body).RootElement;
    }

    static async Task SearchPatients(string name)
    {
        var response = await client.GetAsync($"{BaseUrl}/Patient?name={Uri.EscapeDataString(name)}&_count=10");
        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadAsStringAsync();
        var bundle = JsonDocument.Parse(body).RootElement;
        var total = bundle.GetProperty("total").GetInt32();
        Console.WriteLine($"Found {total} patients named '{name}'");
    }
}
`;export{e as default};