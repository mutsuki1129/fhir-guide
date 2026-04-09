// 使用 C# HttpClient 建立 FHIR R4 Condition 資源
// NuGet：dotnet add package Hl7.Fhir.R4

using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;

var client = new FhirClient("https://hapi.fhir.org/baseR4");

var condition = new Condition
{
    ClinicalStatus = new CodeableConcept(
        "http://terminology.hl7.org/CodeSystem/condition-clinical", "active", "Active"),
    VerificationStatus = new CodeableConcept(
        "http://terminology.hl7.org/CodeSystem/condition-ver-status", "confirmed", "Confirmed"),
    Category = new List<CodeableConcept>
    {
        new CodeableConcept("http://terminology.hl7.org/CodeSystem/condition-category", "encounter-diagnosis")
    },
    Severity = new CodeableConcept("http://snomed.info/sct", "6736007", "Moderate") { Text = "中度" },
    Code = new CodeableConcept("http://hl7.org/fhir/sid/icd-10", "I10", "Essential (primary) hypertension")
    {
        Text = "原發性高血壓"
    },
    Subject = new ResourceReference("Patient/P001", "王大明"),
    Onset = new FhirDateTime("2023-06-15"),
    RecordedDateElement = new Date(DateTime.Today.ToString("yyyy-MM-dd"))
};

var created = await client.CreateAsync(condition);
Console.WriteLine($"Created Condition ID: {created.Id}");

var bundle = await client.SearchAsync<Condition>(new[]
{
    "subject=Patient/P001", "clinical-status=active"
});
Console.WriteLine($"Active conditions: {bundle.Total}");
