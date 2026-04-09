// 使用 C# HttpClient 建立 FHIR R4 MedicationRequest 資源
// NuGet：dotnet add package Hl7.Fhir.R4

using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;

var client = new FhirClient("https://hapi.fhir.org/baseR4");

var medicationRequest = new MedicationRequest
{
    Status = MedicationRequest.MedicationrequestStatus.Active,
    Intent = MedicationRequest.MedicationRequestIntent.Order,
    Medication = new CodeableConcept("http://www.nlm.nih.gov/research/umls/rxnorm", "29046", "Lisinopril")
    {
        Text = "血管收縮素轉化酶抑制劑（高血壓用藥）"
    },
    Subject = new ResourceReference("Patient/P001", "王大明"),
    AuthoredOnElement = new FhirDateTime(DateTimeOffset.Now),
    Requester = new ResourceReference("Practitioner/DR001", "李醫師"),
    DosageInstruction = new List<Dosage>
    {
        new Dosage
        {
            Text = "每日一次，每次10mg，口服",
            DoseAndRate = new List<Dosage.DoseAndRateComponent>
            {
                new Dosage.DoseAndRateComponent
                {
                    Dose = new Quantity { Value = 10, Unit = "mg", System = "http://unitsofmeasure.org", Code = "mg" }
                }
            }
        }
    }
};

var created = await client.CreateAsync(medicationRequest);
Console.WriteLine($"Created MedicationRequest ID: {created.Id}");

var bundle = await client.SearchAsync<MedicationRequest>(new[] { "subject=Patient/P001", "status=active" });
Console.WriteLine($"Active medications: {bundle.Total}");
