package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.NotificationResponse;
import com.myanatomy.sandboxpro.model.Role;
import com.myanatomy.sandboxpro.service.NotificationService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recruiter/notifications")
public class RecruiterNotificationController {

    private final NotificationService notificationService;

    public RecruiterNotificationController(
            NotificationService notificationService
    ) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationResponse> getNotifications(Authentication authentication) {
        return notificationService.getForUser(authentication.getName(), Role.RECRUITER);
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(Authentication authentication) {
        return Map.of(
                "count",
                notificationService.getUnreadCountForUser(authentication.getName(), Role.RECRUITER)
        );
    }

    @PutMapping("/{id}/read")
    public NotificationResponse markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }

    @PutMapping("/read-all")
    public void markAllAsRead(Authentication authentication) {
        notificationService.markAllAsReadForUser(authentication.getName(), Role.RECRUITER);
    }
}
