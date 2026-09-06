package com.myanatomy.sandboxpro.service.eligibility;

import com.myanatomy.sandboxpro.model.Job;
import com.myanatomy.sandboxpro.model.StudentProfile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(5)
public class BranchRule implements EligibilityRule {

    @Override
    public EligibilityEvaluation evaluate(Job job, StudentProfile student) {
        if (job.getEligibleBranches() != null && !job.getEligibleBranches().isBlank()) {
            String studentBranch = student.getBranch();
            if (studentBranch == null || !job.getEligibleBranches().toLowerCase().contains(studentBranch.toLowerCase())) {
                return EligibilityEvaluation.fail("Your branch is not eligible for this opportunity.");
            }
        }
        return EligibilityEvaluation.pass();
    }
}
