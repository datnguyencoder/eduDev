package com.datdev.edudev.order.mapper;

import com.datdev.edudev.order.dto.OrderItemResponse;
import com.datdev.edudev.order.dto.OrderResponse;
import com.datdev.edudev.order.dto.OrderSummaryResponse;
import com.datdev.edudev.order.entity.Order;
import com.datdev.edudev.order.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "status", expression = "java(order.getStatus().name())")
    OrderResponse toResponse(Order order);

    @Mapping(target = "itemType", expression = "java(item.getItemType().name())")
    OrderItemResponse toItemResponse(OrderItem item);

    @Mapping(target = "status", expression = "java(order.getStatus().name())")
    @Mapping(target = "itemCount", expression = "java(order.getItems().size())")
    OrderSummaryResponse toSummaryResponse(Order order);

    List<OrderSummaryResponse> toSummaryResponseList(List<Order> orders);
}
