package com.myanatomy.sandboxpro.service.eligibility;

public record EligibilityEvaluation(boolean eligible, String failureReason) {
    public static EligibilityEvaluation pass() {
        return new EligibilityEvaluation(true, null);
    }
    public static EligibilityEvaluation fail(String reason) {
        return new EligibilityEvaluation(false, reason);
    }
}
