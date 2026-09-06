package com.myanatomy.sandboxpro.service.storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String store(MultipartFile file, String prefix);

    byte[] loadAsBytes(String filePath);

    void delete(String filePath);
}
