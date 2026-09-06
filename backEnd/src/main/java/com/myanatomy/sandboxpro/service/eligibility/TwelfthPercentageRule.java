package com.myanatomy.sandboxpro.service.eligibility;

import com.myanatomy.sandboxpro.model.Job;
import com.myanatomy.sandboxpro.model.StudentProfile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(4)
public class TwelfthPercentageRule implements EligibilityRule {

    @Override
    public EligibilityEvaluation evaluate(Job job, StudentProfile student) {
        if (job.getMinimumTwelfthPercentage() != null) {
            if (student.getTwelfthPercentage() == null || student.getTwelfthPercentage() < job.getMinimumTwelfthPercentage()) {
                return EligibilityEvaluation.fail("Minimum 12th percentage required: " + job.getMinimumTwelfthPercentage());
            }
        }
        return EligibilityEvaluation.pass();
    }
}
