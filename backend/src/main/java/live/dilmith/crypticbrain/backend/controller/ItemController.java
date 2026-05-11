package live.dilmith.crypticbrain.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import live.dilmith.crypticbrain.backend.dto.ItemRequestDto;
import live.dilmith.crypticbrain.backend.dto.ItemResponseDto;
import live.dilmith.crypticbrain.backend.response.ApiResponse;
import live.dilmith.crypticbrain.backend.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@Tag(name = "Items", description = "Endpoints for managing items")
public class ItemController {

    private final ItemService itemService;

    @GetMapping
    @Operation(summary = "Get all items", description = "Retrieves a list of all items")
    public ResponseEntity<ApiResponse<List<ItemResponseDto>>> getAllItems() {
        List<ItemResponseDto> items = itemService.getAllItems();
        return ResponseEntity.ok(ApiResponse.success("Items retrieved successfully", items));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get item by ID", description = "Retrieves a single item by its ID")
    public ResponseEntity<ApiResponse<ItemResponseDto>> getItemById(@PathVariable Long id) {
        ItemResponseDto item = itemService.getItemById(id);
        return ResponseEntity.ok(ApiResponse.success("Item retrieved successfully", item));
    }

    @PostMapping
    @Operation(summary = "Create an item", description = "Creates a new item")
    public ResponseEntity<ApiResponse<ItemResponseDto>> createItem(@Valid @RequestBody ItemRequestDto requestDto) {
        ItemResponseDto item = itemService.createItem(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Item created successfully", item));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an item", description = "Updates an existing item by its ID")
    public ResponseEntity<ApiResponse<ItemResponseDto>> updateItem(
            @PathVariable Long id,
            @Valid @RequestBody ItemRequestDto requestDto) {
        ItemResponseDto item = itemService.updateItem(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Item updated successfully", item));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an item", description = "Deletes an existing item by its ID")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
