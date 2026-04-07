var e=`import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.client.interceptor.LoggingInterceptor;
import org.hl7.fhir.r4.model.*;

import java.util.Date;

/**
 * 使用 HAPI FHIR Client Library 連接 Foundry 上啟動的 FHIR Server
 * 預設使用 FHIR Candle（本地 Foundry 部署）
 *
 * Maven 依賴（pom.xml）：
 * <dependency>
 *   <groupId>ca.uhn.hapi.fhir</groupId>
 *   <artifactId>hapi-fhir-structures-r4</artifactId>
 *   <version>7.4.0</version>
 * </dependency>
 * <dependency>
 *   <groupId>ca.uhn.hapi.fhir</groupId>
 *   <artifactId>hapi-fhir-client</artifactId>
 *   <version>7.4.0</version>
 * </dependency>
 */
public class FoundryFhirClient {

    private static final String FHIR_BASE = "http://localhost:8080/fhir/r4";

    public static void main(String[] args) {
        // 建立 FHIR R4 context
        FhirContext ctx = FhirContext.forR4();
        IGenericClient client = ctx.newRestfulGenericClient(FHIR_BASE);

        // 執行範例操作
        getCapabilityStatement(client);
        String patientId = createPatient(client);
        createBloodPressure(client, patientId);
        searchPatients(client, "王");
    }

    // 1. 取得伺服器能力聲明
    static void getCapabilityStatement(IGenericClient client) {
        CapabilityStatement cs = client.capabilities()
            .ofType(CapabilityStatement.class)
            .execute();
        System.out.println("Server: " + cs.getSoftware().getName());
        System.out.println("FHIR Version: " + cs.getFhirVersion().getDisplay());
    }

    // 2. 建立 Patient
    static String createPatient(IGenericClient client) {
        Patient patient = new Patient();

        // 設定姓名
        HumanName name = patient.addName();
        name.setFamily("王").addGiven("小明").setUse(HumanName.NameUse.OFFICIAL);

        // 設定性別和出生日期
        patient.setGender(Enumerations.AdministrativeGender.MALE);
        patient.setBirthDateElement(new DateType("1990-05-15"));

        // 設定識別碼
        patient.addIdentifier()
            .setSystem("http://example.org/mrn")
            .setValue("MRN-001");

        // 儲存到伺服器
        MethodOutcome outcome = client.create().resource(patient).execute();
        String id = outcome.getId().getIdPart();
        System.out.println("Created Patient ID: " + id);
        return id;
    }

    // 3. 依姓名搜尋 Patient
    static void searchPatients(IGenericClient client, String family) {
        Bundle bundle = client.search()
            .forResource(Patient.class)
            .where(Patient.FAMILY.matches().value(family))
            .returnBundle(Bundle.class)
            .execute();
        System.out.println("Found " + bundle.getTotal() + " patients with family name '" + family + "'");
    }

    // 4. 建立血壓 Observation
    static void createBloodPressure(IGenericClient client, String patientId) {
        Observation obs = new Observation();
        obs.setStatus(Observation.ObservationStatus.FINAL);

        // 設定血壓代碼（LOINC）
        obs.getCode().addCoding()
            .setSystem("http://loinc.org")
            .setCode("55284-4")
            .setDisplay("Blood pressure systolic and diastolic");

        // 設定病患參照
        obs.setSubject(new Reference("Patient/" + patientId));
        obs.setEffective(new DateTimeType(new Date()));

        // 收縮壓
        Observation.ObservationComponentComponent systolic = obs.addComponent();
        systolic.getCode().addCoding()
            .setSystem("http://loinc.org").setCode("8480-6").setDisplay("Systolic blood pressure");
        systolic.setValue(new Quantity()
            .setValue(120).setUnit("mmHg")
            .setSystem("http://unitsofmeasure.org").setCode("mm[Hg]"));

        // 舒張壓
        Observation.ObservationComponentComponent diastolic = obs.addComponent();
        diastolic.getCode().addCoding()
            .setSystem("http://loinc.org").setCode("8462-4").setDisplay("Diastolic blood pressure");
        diastolic.setValue(new Quantity()
            .setValue(80).setUnit("mmHg")
            .setSystem("http://unitsofmeasure.org").setCode("mm[Hg]"));

        MethodOutcome outcome = client.create().resource(obs).execute();
        System.out.println("Created Observation ID: " + outcome.getId().getIdPart());
    }
}
`;export{e as default};