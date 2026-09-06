package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.Notification;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private String title;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;

    public static NotificationResponse from(Notification n) {
        NotificationResponse response = new NotificationResponse();
        response.setId(n.getId());
        response.setTitle(n.getTitle());
        response.setMessage(n.getMessage());
        response.setRead(n.isRead());
        response.setCreatedAt(n.getCreatedAt());
        return response;
    }
}
