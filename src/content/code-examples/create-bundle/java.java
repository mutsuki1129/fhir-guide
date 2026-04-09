// 使用 Java HAPI FHIR Client 執行 FHIR R4 Transaction Bundle
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.*;

import java.util.Date;

public class CreateBundleExample {
    public static void main(String[] args) {
        FhirContext ctx = FhirContext.forR4();
        IGenericClient client = ctx.newRestfulGenericClient("https://hapi.fhir.org/baseR4");

        Bundle transactionBundle = new Bundle();
        transactionBundle.setType(Bundle.BundleType.TRANSACTION);

        // Patient entry
        Patient patient = new Patient();
        patient.addName().setUse(HumanName.NameUse.OFFICIAL)
               .setText("張小明").setFamily("張").addGiven("小明");
        patient.setGender(Enumerations.AdministrativeGender.MALE);
        patient.setBirthDateElement(new DateType("1990-01-15"));

        Bundle.BundleEntryComponent patientEntry = transactionBundle.addEntry();
        patientEntry.setFullUrl("urn:uuid:patient-001");
        patientEntry.setResource(patient);
        patientEntry.getRequest().setMethod(Bundle.HTTPVerb.POST).setUrl("Patient");

        // Observation entry（引用同 bundle 中的 Patient）
        Observation obs = new Observation();
        obs.setStatus(Observation.ObservationStatus.FINAL);
        obs.getCode().addCoding()
                .setSystem("http://loinc.org").setCode("29463-7").setDisplay("Body weight");
        obs.getCode().setText("體重");
        obs.setSubject(new Reference("urn:uuid:patient-001"));
        obs.setEffective(new DateTimeType(new Date()));
        obs.setValue(new Quantity().setValue(70).setUnit("kg")
                .setSystem("http://unitsofmeasure.org").setCode("kg"));

        Bundle.BundleEntryComponent obsEntry = transactionBundle.addEntry();
        obsEntry.setFullUrl("urn:uuid:obs-001");
        obsEntry.setResource(obs);
        obsEntry.getRequest().setMethod(Bundle.HTTPVerb.POST).setUrl("Observation");

        // 執行 transaction
        Bundle responseBundle = client.transaction().withBundle(transactionBundle).execute();
        System.out.println("Transaction type: " + responseBundle.getType());
        for (Bundle.BundleEntryComponent entry : responseBundle.getEntry()) {
            System.out.println("  Status: " + entry.getResponse().getStatus()
                    + ", Location: " + entry.getResponse().getLocation());
        }
    }
}
