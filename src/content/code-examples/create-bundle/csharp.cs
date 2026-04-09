// 使用 C# HttpClient 執行 FHIR R4 Transaction Bundle
// NuGet：dotnet add package Hl7.Fhir.R4

using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;

var client = new FhirClient("https://hapi.fhir.org/baseR4");

var transactionBundle = new Bundle { Type = Bundle.BundleType.Transaction };

// Patient entry
var patient = new Patient
{
    Name = new List<HumanName>
    {
        new HumanName { Use = HumanName.NameUse.Official, Text = "張小明", Family = "張", Given = new[] { "小明" } }
    },
    Gender = AdministrativeGender.Male,
    BirthDate = "1990-01-15"
};
transactionBundle.Entry.Add(new Bundle.EntryComponent
{
    FullUrl = "urn:uuid:patient-001",
    Resource = patient,
    Request = new Bundle.RequestComponent { Method = Bundle.HTTPVerb.POST, Url = "Patient" }
});

// Observation entry（引用同 bundle 中的 Patient）
var observation = new Observation
{
    Status = ObservationStatus.Final,
    Code = new CodeableConcept("http://loinc.org", "29463-7", "Body weight") { Text = "體重" },
    Subject = new ResourceReference("urn:uuid:patient-001"),
    Effective = new FhirDateTime(DateTimeOffset.Now),
    Value = new Quantity { Value = 70, Unit = "kg", System = "http://unitsofmeasure.org", Code = "kg" }
};
transactionBundle.Entry.Add(new Bundle.EntryComponent
{
    FullUrl = "urn:uuid:obs-001",
    Resource = observation,
    Request = new Bundle.RequestComponent { Method = Bundle.HTTPVerb.POST, Url = "Observation" }
});

// 執行 transaction
var responseBundle = await client.TransactionAsync(transactionBundle);
Console.WriteLine($"Transaction result type: {responseBundle.Type}");
foreach (var entry in responseBundle.Entry)
{
    Console.WriteLine($"  Status: {entry.Response?.Status}, Location: {entry.Response?.Location}");
}
