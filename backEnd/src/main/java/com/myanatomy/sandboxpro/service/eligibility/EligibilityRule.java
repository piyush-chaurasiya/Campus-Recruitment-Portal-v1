package com.myanatomy.sandboxpro.service.eligibility;

import com.myanatomy.sandboxpro.model.Job;
import com.myanatomy.sandboxpro.model.StudentProfile;

public interface EligibilityRule {
    EligibilityEvaluation evaluate(Job job, StudentProfile student);
}
