package com.myanatomy.sandboxpro.service.eligibility;

import com.myanatomy.sandboxpro.model.Job;
import com.myanatomy.sandboxpro.model.StudentProfile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class CgpaRule implements EligibilityRule {

    @Override
    public EligibilityEvaluation evaluate(Job job, StudentProfile student) {
        if (job.getMinimumCgpa() != null) {
            if (student.getCgpa() == null || student.getCgpa() < job.getMinimumCgpa()) {
                return EligibilityEvaluation.fail("Minimum CGPA required: " + job.getMinimumCgpa());
            }
        }
        return EligibilityEvaluation.pass();
    }
}
