// 使用 Java HAPI FHIR Client 執行 FHIR R4 基本搜尋
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.param.DateRangeParam;
import org.hl7.fhir.r4.model.*;

public class BasicSearchExample {
    public static void main(String[] args) {
        FhirContext ctx = FhirContext.forR4();
        IGenericClient client = ctx.newRestfulGenericClient("https://hapi.fhir.org/baseR4");

        // 依姓名搜尋
        Bundle byName = client.search().forResource(Patient.class)
                .where(Patient.NAME.matches().value("王"))
                .count(10)
                .returnBundle(Bundle.class).execute();
        System.out.println("Found " + byName.getTotal() + " patients named 王");

        // 組合搜尋：姓名 + 性別
        Bundle byNameAndGender = client.search().forResource(Patient.class)
                .where(Patient.NAME.matches().value("王"))
                .and(Patient.GENDER.exactly().code("male"))
                .returnBundle(Bundle.class).execute();
        System.out.println("Combined search: " + byNameAndGender.getTotal() + " results");

        // 日期範圍搜尋
        Bundle observations = client.search().forResource(Observation.class)
                .where(Observation.SUBJECT.hasId("Patient/P001"))
                .and(Observation.DATE.afterOrEquals().second("2024-01-01"))
                .and(Observation.DATE.beforeOrEquals().second("2024-12-31"))
                .sort().descending(Observation.DATE)
                .returnBundle(Bundle.class).execute();
        System.out.println("Observations in 2024: " + observations.getTotal());

        // 搜尋活躍病情
        Bundle conditions = client.search().forResource(Condition.class)
                .where(Condition.SUBJECT.hasId("Patient/P001"))
                .returnBundle(Bundle.class).execute();
        System.out.println("Active conditions: " + conditions.getTotal());
    }
}
