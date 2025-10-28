//package com.ngp.BookingService.Configuration;
//
//import feign.RequestInterceptor;
//import feign.RequestTemplate;
//import jakarta.servlet.http.HttpServletRequest;
//import org.springframework.http.HttpHeaders;
//import org.springframework.util.StringUtils;
//import org.springframework.web.context.request.RequestContextHolder;
//import org.springframework.web.context.request.ServletRequestAttributes;
//
//public class AuthenticationRequestInterceptor implements RequestInterceptor {
//    @Override
//    public void apply(RequestTemplate requestTemplate) {
//        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
//                .currentRequestAttributes())
//                .getRequest();
//
//        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
//        if(StringUtils.hasText(authHeader)){
//            requestTemplate.header(HttpHeaders.AUTHORIZATION, authHeader);
//        }
//    }
//}
