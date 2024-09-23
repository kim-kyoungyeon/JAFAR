package service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Service
public class ImageUploadService {

    @Autowired
    private AmazonS3 amazonS3;

    @Value("${aws.s3.bucket}")
    private String bucket;

    public String uploadImage(File file) throws IOException {
        String fileName = "article/" + generateFileName(file.getName());
        amazonS3.putObject(new PutObjectRequest(bucket, fileName, file));
        return fileName;
    }


    public byte[] getImage(String fileName) throws IOException {
        try (S3Object s3Object = amazonS3.getObject(bucket, "article/" + fileName);
             S3ObjectInputStream inputStream = s3Object.getObjectContent()) {
            return IOUtils.toByteArray(inputStream);
        }
    }

    public void deleteImage(String fileName) {
        String objectKey = "article/" + fileName;
        amazonS3.deleteObject(bucket, objectKey);
    }


    private String generateFileName(String originalName) {
        return "uuid_" + UUID.randomUUID().toString();
    }
}
