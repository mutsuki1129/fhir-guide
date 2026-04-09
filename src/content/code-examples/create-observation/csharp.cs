// 使用 C# HttpClient 建立 FHIR R4 Observation（血壓）資源
// NuGet：dotnet add package Hl7.Fhir.R4

using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;

var client = new FhirClient("https://hapi.fhir.org/baseR4");

var bloodPressure = new Observation
{
    Status = ObservationStatus.Final,
    Category = new List<CodeableConcept>
    {
        new CodeableConcept("http://terminology.hl7.org/CodeSystem/observation-category", "vital-signs", "Vital Signs")
    },
    Code = new CodeableConcept("http://loinc.org", "55284-4", "Blood pressure systolic and diastolic") { Text = "血壓" },
    Subject = new ResourceReference("Patient/P001", "王大明"),
    Effective = new FhirDateTime(DateTimeOffset.Now),
    Component = new List<Observation.ComponentComponent>
    {
        new Observation.ComponentComponent
        {
            Code = new CodeableConcept("http://loinc.org", "8480-6", "Systolic blood pressure") { Text = "收縮壓" },
            Value = new Quantity { Value = 120, Unit = "mmHg", System = "http://unitsofmeasure.org", Code = "mm[Hg]" }
        },
        new Observation.ComponentComponent
        {
            Code = new CodeableConcept("http://loinc.org", "8462-4", "Diastolic blood pressure") { Text = "舒張壓" },
            Value = new Quantity { Value = 80, Unit = "mmHg", System = "http://unitsofmeasure.org", Code = "mm[Hg]" }
        }
    }
};

// 建立
var created = await client.CreateAsync(bloodPressure);
Console.WriteLine($"Created Observation ID: {created.Id}");

// 搜尋血壓觀察
var bundle = await client.SearchAsync<Observation>(new[]
{
    "subject=Patient/P001",
    "code=55284-4",
    "_sort=-date",
    "_count=5"
});
Console.WriteLine($"Found observations: {bundle.Total}");
foreach (var entry in bundle.Entry)
{
    var obs = (Observation)entry.Resource;
    foreach (var comp in obs.Component)
        Console.WriteLine($"  {comp.Code.Text}: {((Quantity)comp.Value).Value} {((Quantity)comp.Value).Unit}");
}
