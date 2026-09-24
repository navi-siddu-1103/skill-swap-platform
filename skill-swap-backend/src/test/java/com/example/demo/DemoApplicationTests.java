package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.context.SpringBootTest;
import com.example.skillswap.SkillSwapApplication;

@SpringBootTest(classes = SkillSwapApplication.class)
@ActiveProfiles("h2")
class DemoApplicationTests {

	@Test
	void contextLoads() {
	}

}
