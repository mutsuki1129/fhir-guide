// 使用 C# HttpClient 完成 FHIR CRUD 操作
// NuGet：dotnet add package Hl7.Fhir.R4

using Hl7.Fhir.Model;
using Hl7.Fhir.Rest;

var client = new FhirClient("https://hapi.fhir.org/baseR4");

var newPatient = new Patient
{
    Name = new List<HumanName>
    {
        new HumanName { Use = HumanName.NameUse.Official, Text = "林美玲", Family = "林", Given = new[] { "美玲" } }
    },
    Telecom = new List<ContactPoint>
    {
        new ContactPoint { System = ContactPoint.ContactPointSystem.Phone, Value = "0987654321", Use = ContactPoint.ContactPointUse.Mobile }
    },
    Gender = AdministrativeGender.Female,
    BirthDate = "1992-08-25"
};

// CREATE
var created = await client.CreateAsync(newPatient);
Console.WriteLine($"Created Patient ID: {created.Id}");

// READ
var patient = await client.ReadAsync<Patient>($"Patient/{created.Id}");
Console.WriteLine($"Patient name: {patient.Name[0].Text}");

// UPDATE
patient.Telecom.Add(new ContactPoint
{
    System = ContactPoint.ContactPointSystem.Email,
    Value = "mei-ling@example.com",
    Use = ContactPoint.ContactPointUse.Home
});
var updated = await client.UpdateAsync(patient);
Console.WriteLine($"Updated versionId: {updated.Meta.VersionId}");

// SEARCH
var bundle = await client.SearchAsync<Patient>(new[] { "name=林", "gender=female" });
Console.WriteLine($"Search total: {bundle.Total}");

// DELETE
await client.DeleteAsync(updated);
Console.WriteLine("Patient deleted.");
