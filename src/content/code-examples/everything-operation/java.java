// 使用 Java HAPI FHIR Client 執行 FHIR $everything 操作
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.*;

import java.util.Map;
import java.util.stream.Collectors;

public class EverythingOperationExample {
    public static void main(String[] args) {
        FhirContext ctx = FhirContext.forR4();
        IGenericClient client = ctx.newRestfulGenericClient("https://hapi.fhir.org/baseR4");

        // 取得病患的所有相關資源
        Parameters inParams = new Parameters();
        inParams.addParameter().setName("_count").setValue(new IntegerType(50));

        Bundle bundle = (Bundle) client.operation()
                .onInstance(new IdType("Patient", "P001"))
                .named("$everything")
                .withParameters(inParams)
                .returnResourceType(Bundle.class)
                .execute();

        System.out.println("Patient $everything:");
        System.out.println("  Total resources: " + (bundle.hasTotal() ? bundle.getTotal() : bundle.getEntry().size()));

        // 按資源類型分組統計
        Map<String, Long> byType = bundle.getEntry().stream()
                .collect(Collectors.groupingBy(
                        e -> e.getResource() != null ? e.getResource().getResourceType().name() : "Unknown",
                        Collectors.counting()
                ));

        byType.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(e -> System.out.println("  " + e.getKey() + ": " + e.getValue()));

        // 帶日期範圍
        Parameters rangeParams = new Parameters();
        rangeParams.addParameter().setName("start").setValue(new DateType("2024-01-01"));
        rangeParams.addParameter().setName("end").setValue(new DateType("2024-12-31"));

        Bundle rangeBundle = (Bundle) client.operation()
                .onInstance(new IdType("Patient", "P001"))
                .named("$everything")
                .withParameters(rangeParams)
                .returnResourceType(Bundle.class)
                .execute();

        System.out.println("\nResources in 2024: " + rangeBundle.getEntry().size());
    }
}
