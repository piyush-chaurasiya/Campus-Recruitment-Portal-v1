package com.myanatomy.sandboxpro.repository;

import com.myanatomy.sandboxpro.model.Notification;
import com.myanatomy.sandboxpro.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByTargetRoleOrderByCreatedAtDesc(
            Role targetRole
    );

    long countByTargetRoleAndReadFalse(Role targetRole);

    @Query("SELECT n FROM Notification n WHERE n.recipientEmail = :email OR (n.targetRole = :role AND n.recipientEmail IS NULL) ORDER BY n.createdAt DESC")
    List<Notification> findForUserOrRole(@Param("email") String email, @Param("role") Role role);

    @Query("SELECT COUNT(n) FROM Notification n WHERE (n.recipientEmail = :email OR (n.targetRole = :role AND n.recipientEmail IS NULL)) AND n.read = false")
    long countUnreadForUserOrRole(@Param("email") String email, @Param("role") Role role);
}
