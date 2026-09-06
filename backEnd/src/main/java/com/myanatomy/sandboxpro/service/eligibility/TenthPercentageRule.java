package com.myanatomy.sandboxpro.service.eligibility;

import com.myanatomy.sandboxpro.model.Job;
import com.myanatomy.sandboxpro.model.StudentProfile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(3)
public class TenthPercentageRule implements EligibilityRule {

    @Override
    public EligibilityEvaluation evaluate(Job job, StudentProfile student) {
        if (job.getMinimumTenthPercentage() != null) {
            if (student.getTenthPercentage() == null || student.getTenthPercentage() < job.getMinimumTenthPercentage()) {
                return EligibilityEvaluation.fail("Minimum 10th percentage required: " + job.getMinimumTenthPercentage());
            }
        }
        return EligibilityEvaluation.pass();
    }
}
