// 使用 C# HttpClient 執行 FHIR R4 基本搜尋
// NuGet：dotnet add package Hl7.Fhir.R4

using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;

var client = new FhirClient("https://hapi.fhir.org/baseR4");

// 依姓名搜尋
var byName = await client.SearchAsync<Patient>(new[] { "name=王", "_count=10" });
Console.WriteLine($"Found {byName.Total} patients named 王");

// 組合搜尋
var byNameAndGender = await client.SearchAsync<Patient>(new[] { "name=王", "gender=male" });
Console.WriteLine($"Combined search: {byNameAndGender.Total} results");

// 日期範圍搜尋
var observations = await client.SearchAsync<Observation>(new[]
{
    "subject=Patient/P001",
    "date=ge2024-01-01",
    "date=le2024-12-31",
    "_sort=-date"
});
Console.WriteLine($"Observations in 2024: {observations.Total}");

// 搜尋活躍病情
var conditions = await client.SearchAsync<Condition>(new[]
{
    "subject=Patient/P001",
    "clinical-status=active"
});
Console.WriteLine($"Active conditions: {conditions.Total}");
foreach (var entry in conditions.Entry)
{
    var cond = (Condition)entry.Resource;
    Console.WriteLine($"  - {cond.Code?.Text} (onset: {cond.Onset})");
}
