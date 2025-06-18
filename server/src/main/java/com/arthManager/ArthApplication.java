package com.arthManager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class ArthApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArthApplication.class, args);
	}

//	Added
	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
//

}
