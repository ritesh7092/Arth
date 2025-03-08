//package com.taskManager.config;
//
//import com.taskManager.service.UserService;
//import io.jsonwebtoken.ExpiredJwtException;
//import lombok.RequiredArgsConstructor;
//import org.springframework.lang.NonNull;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import java.io.IOException;
//
//@Component
//@RequiredArgsConstructor
//public class JwtAuthenticationFilter extends OncePerRequestFilter {
//
//    private final JwtUtil jwtUtil;
//    private final UserService userService;
//
//    @Override
//    protected void doFilterInternal(
//            @NonNull HttpServletRequest request,
//            @NonNull HttpServletResponse response,
//            @NonNull FilterChain chain
//    ) throws ServletException, IOException {
//
//        String authHeader = request.getHeader("Authorization");
//        String token = null;
//        String username = null;
//
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            token = authHeader.substring(7);
//            try {
//                username = jwtUtil.extractUsername(token);
//            } catch (ExpiredJwtException e) {
//                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT Token Expired");
//                return;
//            }
//        }
//
//        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//            UserDetails userDetails = userService.loadUserByUsername(username);
//
//            if (jwtUtil.isTokenValid(token, userDetails)) {  // Ensure this method exists
//                UsernamePasswordAuthenticationToken authToken =
//                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//
//                SecurityContextHolder.getContext().setAuthentication(authToken);
//            }
//        }
//
//        chain.doFilter(request, response);
//    }
//}







 package com.taskManager.config;

 import com.taskManager.service.UserService;
 import io.jsonwebtoken.ExpiredJwtException;
 import lombok.RequiredArgsConstructor;
 import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
 import org.springframework.security.core.context.SecurityContextHolder;
 import org.springframework.security.core.userdetails.UserDetails;
 import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
 import org.springframework.stereotype.Component;
 import org.springframework.web.filter.OncePerRequestFilter;

 import jakarta.servlet.FilterChain;
 import jakarta.servlet.ServletException;
 import jakarta.servlet.http.HttpServletRequest;
 import jakarta.servlet.http.HttpServletResponse;
 import java.io.IOException;

 @Component
 @RequiredArgsConstructor
 public class JwtAuthenticationFilter extends OncePerRequestFilter {

     private final JwtUtil jwtUtil;
     private final UserService userService;

     @Override
     protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
             throws ServletException, IOException {
        
         String authHeader = request.getHeader("Authorization");
         String token = null;
         String username = null;

         if (authHeader != null && authHeader.startsWith("Bearer ")) {
             token = authHeader.substring(7);
             try {
                 username = jwtUtil.extractUsername(token);
             } catch (ExpiredJwtException e) {
                 response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT Token Expired");
                 return;
             }
         }

         if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
             UserDetails userDetails = userService.loadUserByUsername(username);

             if (jwtUtil.isTokenValid(token, userDetails)) {
                 UsernamePasswordAuthenticationToken authToken =
                         new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                 authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                 SecurityContextHolder.getContext().setAuthentication(authToken);
             }
         }

         chain.doFilter(request, response);
     }
 }
