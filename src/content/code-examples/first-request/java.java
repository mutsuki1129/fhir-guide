// 使用 Java HAPI FHIR Client 完成 FHIR CRUD 操作
// Maven：ca.uhn.hapi.fhir:hapi-fhir-client:7.0.0

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.*;

public class FhirCrudExample {
    public static void main(String[] args) {
        FhirContext ctx = FhirContext.forR4();
        IGenericClient client = ctx.newRestfulGenericClient("https://hapi.fhir.org/baseR4");

        // 建立 Patient
        Patient patient = new Patient();
        patient.addName().setUse(HumanName.NameUse.OFFICIAL)
               .setText("林美玲").setFamily("林").addGiven("美玲");
        patient.addTelecom()
               .setSystem(ContactPoint.ContactPointSystem.PHONE)
               .setValue("0987654321")
               .setUse(ContactPoint.ContactPointUse.MOBILE);
        patient.setGender(Enumerations.AdministrativeGender.FEMALE);
        patient.setBirthDateElement(new DateType("1992-08-25"));

        // CREATE
        MethodOutcome outcome = client.create().resource(patient).execute();
        String id = outcome.getId().getIdPart();
        System.out.println("Created Patient ID: " + id);

        // READ
        Patient fetched = client.read().resource(Patient.class).withId(id).execute();
        System.out.println("Patient name: " + fetched.getNameFirstRep().getText());

        // UPDATE
        fetched.addTelecom()
               .setSystem(ContactPoint.ContactPointSystem.EMAIL)
               .setValue("mei-ling@example.com")
               .setUse(ContactPoint.ContactPointUse.HOME);
        MethodOutcome updated = client.update().resource(fetched).execute();
        System.out.println("Updated versionId: " + updated.getId().getVersionIdPart());

        // SEARCH
        Bundle bundle = client.search().forResource(Patient.class)
                .where(Patient.NAME.matches().value("林"))
                .and(Patient.GENDER.exactly().code("female"))
                .returnBundle(Bundle.class).execute();
        System.out.println("Search total: " + bundle.getTotal());

        // DELETE
        client.delete().resourceById("Patient", id).execute();
        System.out.println("Patient deleted.");
    }
}
