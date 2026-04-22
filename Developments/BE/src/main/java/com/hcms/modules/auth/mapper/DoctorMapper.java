package com.hcms.modules.auth.mapper;

import com.hcms.modules.auth.dto.DoctorResponse;
import com.hcms.modules.auth.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DoctorMapper {
    DoctorResponse toDoctorResponse(User user);
}
