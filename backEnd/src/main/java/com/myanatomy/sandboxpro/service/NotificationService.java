package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.NotificationResponse;
import com.myanatomy.sandboxpro.model.Notification;
import com.myanatomy.sandboxpro.model.Role;
import com.myanatomy.sandboxpro.repository.NotificationRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository
    ) {
        this.notificationRepository = notificationRepository;
    }

    public void notifyRole(Role role, String title, String message) {

        Notification notification = new Notification();
        notification.setTargetRole(role);
        notification.setTitle(title);
        notification.setMessage(message);

        notificationRepository.save(notification);
    }

    public void notifyUser(String recipientEmail, Role role, String title, String message) {

        Notification notification = new Notification();
        notification.setTargetRole(role);
        notification.setRecipientEmail(recipientEmail);
        notification.setTitle(title);
        notification.setMessage(message);

        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getForUser(String email, Role role) {

        return notificationRepository
                .findForUserOrRole(email, role)
                .stream()
                .map(NotificationResponse::from)
                .toList();
    }

    public long getUnreadCountForUser(String email, Role role) {
        return notificationRepository
                .countUnreadForUserOrRole(email, role);
    }

    public void markAllAsReadForUser(String email, Role role) {

        List<Notification> notifications = notificationRepository
                .findForUserOrRole(email, role);

        notifications.forEach(n -> n.setRead(true));

        notificationRepository.saveAll(notifications);
    }

    public List<NotificationResponse> getForRole(Role role) {

        return notificationRepository
                .findByTargetRoleOrderByCreatedAtDesc(role)
                .stream()
                .map(NotificationResponse::from)
                .toList();
    }

    public long getUnreadCount(Role role) {
        return notificationRepository
                .countByTargetRoleAndReadFalse(role);
    }

    public NotificationResponse markAsRead(Long id) {

        Notification notification = notificationRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Notification not found."
                        )
                );

        notification.setRead(true);

        return NotificationResponse.from(
                notificationRepository.save(notification)
        );
    }

    public void markAllAsRead(Role role) {

        List<Notification> notifications = notificationRepository
                .findByTargetRoleOrderByCreatedAtDesc(role);

        notifications.forEach(n -> n.setRead(true));

        notificationRepository.saveAll(notifications);
    }
}
