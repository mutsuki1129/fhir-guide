// 使用 C# HttpClient 執行 FHIR $everything 操作
// NuGet：dotnet add package Hl7.Fhir.R4

using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;

var client = new FhirClient("https://hapi.fhir.org/baseR4");

// 取得病患的所有相關資源
var parameters = new Parameters();
parameters.Add("_count", new Integer(50));

var bundle = await client.InstanceOperationAsync(
    new ResourceIdentifier("Patient/P001"),
    "$everything",
    parameters
) as Bundle;

Console.WriteLine($"Patient $everything:");
Console.WriteLine($"  Total resources: {bundle?.Total ?? bundle?.Entry.Count}");

// 按資源類型分組
var byType = bundle?.Entry
    .GroupBy(e => e.Resource?.TypeName ?? "Unknown")
    .OrderBy(g => g.Key)
    .ToDictionary(g => g.Key, g => g.Count());

foreach (var (type, count) in byType ?? new())
    Console.WriteLine($"  {type}: {count}");

// 帶日期範圍
var rangeParams = new Parameters();
rangeParams.Add("start", new Date("2024-01-01"));
rangeParams.Add("end", new Date("2024-12-31"));

var rangeBundle = await client.InstanceOperationAsync(
    new ResourceIdentifier("Patient/P001"),
    "$everything",
    rangeParams
) as Bundle;
Console.WriteLine($"\nResources in 2024: {rangeBundle?.Entry.Count}");
