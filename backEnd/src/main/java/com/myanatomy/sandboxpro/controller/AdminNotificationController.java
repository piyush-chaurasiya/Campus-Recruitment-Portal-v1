package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.NotificationResponse;
import com.myanatomy.sandboxpro.model.Role;
import com.myanatomy.sandboxpro.service.NotificationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/notifications")
public class AdminNotificationController {

    private final NotificationService notificationService;

    public AdminNotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationResponse> getNotifications(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return notificationService.getForUser(email, Role.ADMIN);
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return Map.of(
                "count",
                notificationService.getUnreadCountForUser(email, Role.ADMIN)
        );
    }

    @PutMapping("/{id}/read")
    public NotificationResponse markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }

    @PutMapping("/read-all")
    public void markAllAsRead(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        notificationService.markAllAsReadForUser(email, Role.ADMIN);
    }
}
