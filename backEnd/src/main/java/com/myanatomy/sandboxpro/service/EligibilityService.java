package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.model.Job;
import com.myanatomy.sandboxpro.model.StudentProfile;
import com.myanatomy.sandboxpro.service.eligibility.EligibilityEvaluation;
import com.myanatomy.sandboxpro.service.eligibility.EligibilityRule;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EligibilityService {

    private final List<EligibilityRule> rules;

    public EligibilityService(List<EligibilityRule> rules) {
        this.rules = rules;
    }

    public EligibilityResult check(Job job, StudentProfile student) {
        if (student == null) {
            return new EligibilityResult(false, "Student profile is incomplete.");
        }

        for (EligibilityRule rule : rules) {
            EligibilityEvaluation evaluation = rule.evaluate(job, student);
            if (!evaluation.eligible()) {
                return new EligibilityResult(false, evaluation.failureReason());
            }
        }

        return new EligibilityResult(true, "You are eligible for this opportunity.");
    }

    public record EligibilityResult(boolean eligible, String reason) {}
}
