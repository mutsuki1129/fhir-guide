// 使用 C# HttpClient 建立 FHIR R4 Encounter 資源
// NuGet：dotnet add package Hl7.Fhir.R4

using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;

var client = new FhirClient("https://hapi.fhir.org/baseR4");

var encounter = new Encounter
{
    Status = Encounter.EncounterStatus.Finished,
    Class = new Coding("http://terminology.hl7.org/CodeSystem/v3-ActCode", "AMB", "門診"),
    Type = new List<CodeableConcept>
    {
        new CodeableConcept("http://snomed.info/sct", "11429006", "Consultation") { Text = "一般門診" }
    },
    Subject = new ResourceReference("Patient/P001", "王大明"),
    Participant = new List<Encounter.ParticipantComponent>
    {
        new Encounter.ParticipantComponent
        {
            Individual = new ResourceReference("Practitioner/DR001", "李醫師")
        }
    },
    Period = new Period
    {
        StartElement = new FhirDateTime("2024-01-20T09:00:00+08:00"),
        EndElement = new FhirDateTime("2024-01-20T09:30:00+08:00")
    },
    ReasonCode = new List<CodeableConcept>
    {
        new CodeableConcept("http://snomed.info/sct", "38341003", "Hypertension") { Text = "高血壓追蹤" }
    }
};

var created = await client.CreateAsync(encounter);
Console.WriteLine($"Created Encounter ID: {created.Id}");

var bundle = await client.SearchAsync<Encounter>(new[] { "subject=Patient/P001", "status=finished", "_sort=-date" });
Console.WriteLine($"Found encounters: {bundle.Total}");
