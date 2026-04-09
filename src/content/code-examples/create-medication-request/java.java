// 使用 Java HAPI FHIR Client 建立 FHIR R4 MedicationRequest 資源
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.*;

import java.util.Date;

public class CreateMedicationRequestExample {
    public static void main(String[] args) {
        FhirContext ctx = FhirContext.forR4();
        IGenericClient client = ctx.newRestfulGenericClient("https://hapi.fhir.org/baseR4");

        MedicationRequest medReq = new MedicationRequest();
        medReq.setStatus(MedicationRequest.MedicationrequestStatus.ACTIVE);
        medReq.setIntent(MedicationRequest.MedicationRequestIntent.ORDER);

        CodeableConcept medication = new CodeableConcept();
        medication.addCoding()
                .setSystem("http://www.nlm.nih.gov/research/umls/rxnorm")
                .setCode("29046").setDisplay("Lisinopril");
        medication.setText("血管收縮素轉化酶抑制劑（高血壓用藥）");
        medReq.setMedication(medication);

        medReq.setSubject(new Reference("Patient/P001").setDisplay("王大明"));
        medReq.setAuthoredOn(new Date());
        medReq.setRequester(new Reference("Practitioner/DR001").setDisplay("李醫師"));

        Dosage dosage = medReq.addDosageInstruction();
        dosage.setText("每日一次，每次10mg，口服");
        dosage.addDoseAndRate()
                .setDose(new Quantity().setValue(10).setUnit("mg")
                        .setSystem("http://unitsofmeasure.org").setCode("mg"));

        MethodOutcome outcome = client.create().resource(medReq).execute();
        System.out.println("Created MedicationRequest ID: " + outcome.getId().getIdPart());

        Bundle bundle = client.search().forResource(MedicationRequest.class)
                .where(MedicationRequest.SUBJECT.hasId("Patient/P001"))
                .returnBundle(Bundle.class).execute();
        System.out.println("Active medications: " + bundle.getTotal());
    }
}
