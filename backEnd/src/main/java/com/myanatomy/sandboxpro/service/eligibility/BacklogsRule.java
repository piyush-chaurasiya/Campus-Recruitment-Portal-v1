package com.myanatomy.sandboxpro.service.eligibility;

import com.myanatomy.sandboxpro.model.Job;
import com.myanatomy.sandboxpro.model.StudentProfile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class BacklogsRule implements EligibilityRule {

    @Override
    public EligibilityEvaluation evaluate(Job job, StudentProfile student) {
        if (job.getMaximumBacklogs() != null) {
            if (student.getBacklogs() == null || student.getBacklogs() > job.getMaximumBacklogs()) {
                return EligibilityEvaluation.fail("Maximum allowed backlogs: " + job.getMaximumBacklogs());
            }
        }
        return EligibilityEvaluation.pass();
    }
}
