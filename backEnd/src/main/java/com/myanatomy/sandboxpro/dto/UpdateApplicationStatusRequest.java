package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateApplicationStatusRequest {
    private ApplicationStatus status;
    private String remarks;
}
