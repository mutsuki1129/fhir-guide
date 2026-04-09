// 使用 Java HAPI FHIR Client 執行 FHIR $validate 操作
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.r4.model.*;

public class ValidateOperationExample {
    public static void main(String[] args) {
        FhirContext ctx = FhirContext.forR4();
        IGenericClient client = ctx.newRestfulGenericClient("https://hapi.fhir.org/baseR4");

        // 建立要驗證的 Patient
        Patient validPatient = new Patient();
        validPatient.addName().setFamily("陳").addGiven("小華");
        validPatient.setGender(Enumerations.AdministrativeGender.FEMALE);
        validPatient.setBirthDateElement(new DateType("1990-07-20"));

        System.out.println("=== 驗證正確的 Patient ===");
        MethodOutcome outcome = client.validate().resource(validPatient).execute();
        OperationOutcome operationOutcome = (OperationOutcome) outcome.getOperationOutcome();

        boolean hasErrors = false;
        for (OperationOutcome.OperationOutcomeIssueComponent issue : operationOutcome.getIssue()) {
            String severity = issue.getSeverity().toCode();
            if ("error".equals(severity) || "fatal".equals(severity)) {
                System.out.println("❌ Error: " + issue.getDiagnostics());
                hasErrors = true;
            } else if ("warning".equals(severity)) {
                System.out.println("⚠️  Warning: " + issue.getDiagnostics());
            }
        }

        if (!hasErrors) {
            System.out.println("✅ Validation passed!");
        }

        // 列出所有 issue
        System.out.println("\n=== 所有驗證結果 ===");
        for (OperationOutcome.OperationOutcomeIssueComponent issue : operationOutcome.getIssue()) {
            System.out.printf("[%s] %s%n", issue.getSeverity().toCode(), issue.getDiagnostics());
        }
    }
}
