// 使用 HAPI FHIR Java Client 建立 FHIR R4 Patient 資源
// Maven 依賴：
// <dependency>
//   <groupId>ca.uhn.hapi.fhir</groupId>
//   <artifactId>hapi-fhir-structures-r4</artifactId>
//   <version>7.4.0</version>
// </dependency>
// <dependency>
//   <groupId>ca.uhn.hapi.fhir</groupId>
//   <artifactId>hapi-fhir-client</artifactId>
//   <version>7.4.0</version>
// </dependency>

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.*;

public class CreatePatient {

    private static final String BASE_URL = "https://hapi.fhir.org/baseR4";

    public static void main(String[] args) {
        // 初始化 FHIR Context（R4）
        FhirContext ctx = FhirContext.forR4();

        // 建立 REST Client
        IGenericClient client = ctx.newRestfulGenericClient(BASE_URL);

        // 建立 Patient 資源
        Patient patient = buildPatient();

        // 送出 POST 請求
        MethodOutcome outcome = client.create()
                .resource(patient)
                .prettyPrint()
                .encodedJson()
                .execute();

        // 取得建立後的 ID
        String patientId = outcome.getId().getIdPart();
        System.out.println("Patient created, ID: " + patientId);

        // 讀取剛建立的病患
        Patient fetched = client.read()
                .resource(Patient.class)
                .withId(patientId)
                .execute();

        System.out.println("Patient name: " + fetched.getNameFirstRep().getNameAsSingleString());

        // 搜尋病患
        Bundle bundle = client.search()
                .forResource(Patient.class)
                .where(Patient.NAME.matches().value("王"))
                .count(10)
                .returnBundle(Bundle.class)
                .execute();

        System.out.println("Found " + bundle.getTotal() + " patients");
    }

    private static Patient buildPatient() {
        Patient patient = new Patient();

        // Identifier（健保 ID）
        patient.addIdentifier()
                .setUse(Identifier.IdentifierUse.OFFICIAL)
                .setSystem("https://www.nhi.gov.tw")
                .setValue("A123456789");

        // 姓名
        patient.addName()
                .setUse(HumanName.NameUse.OFFICIAL)
                .setText("王大明")
                .setFamily("王")
                .addGiven("大明");

        // 電話
        patient.addTelecom()
                .setSystem(ContactPoint.ContactPointSystem.PHONE)
                .setValue("0912345678")
                .setUse(ContactPoint.ContactPointUse.MOBILE);

        // 性別
        patient.setGender(Enumerations.AdministrativeGender.MALE);

        // 生日
        patient.setBirthDateElement(new DateType("1985-03-15"));

        // 地址
        patient.addAddress()
                .setUse(Address.AddressUse.HOME)
                .setCity("台北市")
                .setCountry("TW");

        // Narrative text
        patient.getText()
                .setStatus(Narrative.NarrativeStatus.GENERATED)
                .setDivAsString("<div xmlns=\"http://www.w3.org/1999/xhtml\">王大明</div>");

        return patient;
    }
}
