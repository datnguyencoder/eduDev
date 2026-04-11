package com.datdev.edudev.auth.mapper;

import com.datdev.edudev.auth.dto.UserMeResponse;
import com.datdev.edudev.auth.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "role", expression = "java(user.getRole().name())")
    @Mapping(target = "status", expression = "java(user.getStatus().name())")
    UserMeResponse toMeResponse(User user);
}
