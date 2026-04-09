// 使用 C# HttpClient 執行 FHIR $validate 操作
// NuGet：dotnet add package Hl7.Fhir.R4

using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;

var client = new FhirClient("https://hapi.fhir.org/baseR4");

bool ValidateResource(OperationOutcome outcome)
{
    var errors = outcome.Issue.Where(i =>
        i.Severity == OperationOutcome.IssueSeverity.Error ||
        i.Severity == OperationOutcome.IssueSeverity.Fatal).ToList();

    if (errors.Count == 0)
    {
        Console.WriteLine("✅ Validation passed!");
        return true;
    }
    Console.WriteLine("❌ Validation failed:");
    foreach (var e in errors)
        Console.WriteLine($"  Error: {e.Diagnostics} [{string.Join(", ", e.Location)}]");
    return false;
}

// 驗證正確的 Patient
var validPatient = new Patient
{
    Name = new List<HumanName>
    {
        new HumanName { Family = "陳", Given = new[] { "小華" } }
    },
    Gender = AdministrativeGender.Female,
    BirthDate = "1990-07-20"
};

Console.WriteLine("=== 驗證正確的 Patient ===");
var outcome1 = await client.ValidateResourceAsync(validPatient);
ValidateResource(outcome1);

// 驗證錯誤的 Patient
var invalidPatient = new Patient
{
    Name = new List<HumanName> { new HumanName { Family = "測試" } },
    // Gender 故意設為不合法的值（需使用低階方式傳遞）
};

Console.WriteLine("\n=== 驗證 OperationOutcome 結果 ===");
foreach (var issue in outcome1.Issue)
    Console.WriteLine($"  [{issue.Severity}] {issue.Diagnostics}");
