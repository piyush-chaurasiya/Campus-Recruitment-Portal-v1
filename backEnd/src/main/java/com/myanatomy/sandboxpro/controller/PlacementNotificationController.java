package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.NotificationResponse;
import com.myanatomy.sandboxpro.model.Role;
import com.myanatomy.sandboxpro.service.NotificationService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/placement/notifications")
public class PlacementNotificationController {

    private final NotificationService notificationService;

    public PlacementNotificationController(
            NotificationService notificationService
    ) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationResponse> getNotifications() {
        return notificationService.getForRole(Role.PLACEMENT_OFFICER);
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount() {
        return Map.of(
                "count",
                notificationService.getUnreadCount(Role.PLACEMENT_OFFICER)
        );
    }

    @PutMapping("/{id}/read")
    public NotificationResponse markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }

    @PutMapping("/read-all")
    public void markAllAsRead() {
        notificationService.markAllAsRead(Role.PLACEMENT_OFFICER);
    }
}
