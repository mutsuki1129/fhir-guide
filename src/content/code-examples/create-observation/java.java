// 使用 Java HAPI FHIR Client 建立 FHIR R4 Observation（血壓）資源
// Maven：ca.uhn.hapi.fhir:hapi-fhir-client:7.0.0

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.*;

import java.util.Date;

public class CreateObservationExample {
    public static void main(String[] args) {
        FhirContext ctx = FhirContext.forR4();
        IGenericClient client = ctx.newRestfulGenericClient("https://hapi.fhir.org/baseR4");

        Observation bloodPressure = new Observation();
        bloodPressure.setStatus(Observation.ObservationStatus.FINAL);
        bloodPressure.addCategory()
                .addCoding()
                .setSystem("http://terminology.hl7.org/CodeSystem/observation-category")
                .setCode("vital-signs").setDisplay("Vital Signs");
        bloodPressure.getCode()
                .addCoding().setSystem("http://loinc.org")
                .setCode("55284-4").setDisplay("Blood pressure systolic and diastolic");
        bloodPressure.getCode().setText("血壓");
        bloodPressure.setSubject(new Reference("Patient/P001").setDisplay("王大明"));
        bloodPressure.setEffective(new DateTimeType(new Date()));

        // 收縮壓
        Observation.ObservationComponentComponent systolic = bloodPressure.addComponent();
        systolic.getCode().addCoding().setSystem("http://loinc.org").setCode("8480-6").setDisplay("Systolic blood pressure");
        systolic.getCode().setText("收縮壓");
        Quantity systolicVal = new Quantity();
        systolicVal.setValue(120).setUnit("mmHg").setSystem("http://unitsofmeasure.org").setCode("mm[Hg]");
        systolic.setValue(systolicVal);

        // 舒張壓
        Observation.ObservationComponentComponent diastolic = bloodPressure.addComponent();
        diastolic.getCode().addCoding().setSystem("http://loinc.org").setCode("8462-4").setDisplay("Diastolic blood pressure");
        diastolic.getCode().setText("舒張壓");
        Quantity diastolicVal = new Quantity();
        diastolicVal.setValue(80).setUnit("mmHg").setSystem("http://unitsofmeasure.org").setCode("mm[Hg]");
        diastolic.setValue(diastolicVal);

        // 建立
        MethodOutcome outcome = client.create().resource(bloodPressure).execute();
        System.out.println("Created Observation ID: " + outcome.getId().getIdPart());

        // 搜尋血壓觀察
        Bundle bundle = client.search().forResource(Observation.class)
                .where(Observation.SUBJECT.hasId("Patient/P001"))
                .and(Observation.CODE.exactly().systemAndCode("http://loinc.org", "55284-4"))
                .count(5)
                .returnBundle(Bundle.class).execute();
        System.out.println("Found observations: " + bundle.getTotal());
    }
}
