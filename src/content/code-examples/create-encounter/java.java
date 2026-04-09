// 使用 Java HAPI FHIR Client 建立 FHIR R4 Encounter 資源
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.*;

public class CreateEncounterExample {
    public static void main(String[] args) {
        FhirContext ctx = FhirContext.forR4();
        IGenericClient client = ctx.newRestfulGenericClient("https://hapi.fhir.org/baseR4");

        Encounter encounter = new Encounter();
        encounter.setStatus(Encounter.EncounterStatus.FINISHED);
        encounter.setClass_(new Coding()
                .setSystem("http://terminology.hl7.org/CodeSystem/v3-ActCode")
                .setCode("AMB").setDisplay("門診"));
        encounter.addType()
                .addCoding().setSystem("http://snomed.info/sct")
                .setCode("11429006").setDisplay("Consultation");
        encounter.getTypeFirstRep().setText("一般門診");
        encounter.setSubject(new Reference("Patient/P001").setDisplay("王大明"));
        encounter.addParticipant()
                .setIndividual(new Reference("Practitioner/DR001").setDisplay("李醫師"));
        encounter.setPeriod(new Period()
                .setStartElement(new DateTimeType("2024-01-20T09:00:00+08:00"))
                .setEndElement(new DateTimeType("2024-01-20T09:30:00+08:00")));
        encounter.addReasonCode()
                .addCoding().setSystem("http://snomed.info/sct")
                .setCode("38341003").setDisplay("Hypertension");
        encounter.getReasonCodeFirstRep().setText("高血壓追蹤");

        MethodOutcome outcome = client.create().resource(encounter).execute();
        System.out.println("Created Encounter ID: " + outcome.getId().getIdPart());

        Bundle bundle = client.search().forResource(Encounter.class)
                .where(Encounter.SUBJECT.hasId("Patient/P001"))
                .returnBundle(Bundle.class).execute();
        System.out.println("Found encounters: " + bundle.getTotal());
    }
}
