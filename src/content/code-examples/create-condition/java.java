// 使用 Java HAPI FHIR Client 建立 FHIR R4 Condition 資源
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.*;

import java.time.LocalDate;

public class CreateConditionExample {
    public static void main(String[] args) {
        FhirContext ctx = FhirContext.forR4();
        IGenericClient client = ctx.newRestfulGenericClient("https://hapi.fhir.org/baseR4");

        Condition condition = new Condition();
        condition.getClinicalStatus()
                .addCoding().setSystem("http://terminology.hl7.org/CodeSystem/condition-clinical")
                .setCode("active");
        condition.getVerificationStatus()
                .addCoding().setSystem("http://terminology.hl7.org/CodeSystem/condition-ver-status")
                .setCode("confirmed");
        condition.addCategory()
                .addCoding().setSystem("http://terminology.hl7.org/CodeSystem/condition-category")
                .setCode("encounter-diagnosis");
        condition.getSeverity()
                .addCoding().setSystem("http://snomed.info/sct")
                .setCode("6736007").setDisplay("Moderate");
        condition.getSeverity().setText("中度");
        condition.getCode()
                .addCoding().setSystem("http://hl7.org/fhir/sid/icd-10")
                .setCode("I10").setDisplay("Essential (primary) hypertension");
        condition.getCode().setText("原發性高血壓");
        condition.setSubject(new Reference("Patient/P001").setDisplay("王大明"));
        condition.setOnset(new DateTimeType("2023-06-15"));
        condition.setRecordedDateElement(new DateType(LocalDate.now().toString()));

        MethodOutcome outcome = client.create().resource(condition).execute();
        System.out.println("Created Condition ID: " + outcome.getId().getIdPart());

        Bundle bundle = client.search().forResource(Condition.class)
                .where(Condition.SUBJECT.hasId("Patient/P001"))
                .returnBundle(Bundle.class).execute();
        System.out.println("Found conditions: " + bundle.getTotal());
    }
}
