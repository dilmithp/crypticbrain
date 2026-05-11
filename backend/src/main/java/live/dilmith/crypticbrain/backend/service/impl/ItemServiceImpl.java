package live.dilmith.crypticbrain.backend.service.impl;

import live.dilmith.crypticbrain.backend.dto.ItemRequestDto;
import live.dilmith.crypticbrain.backend.dto.ItemResponseDto;
import live.dilmith.crypticbrain.backend.entity.Item;
import live.dilmith.crypticbrain.backend.exception.ResourceNotFoundException;
import live.dilmith.crypticbrain.backend.repository.ItemRepository;
import live.dilmith.crypticbrain.backend.service.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;

    @Override
    public List<ItemResponseDto> getAllItems() {
        log.info("Fetching all items");
        return itemRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ItemResponseDto getItemById(Long id) {
        log.info("Fetching item with id: {}", id);
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        return mapToDto(item);
    }

    @Override
    public ItemResponseDto createItem(ItemRequestDto requestDto) {
        log.info("Creating new item with name: {}", requestDto.getName());
        Item item = Item.builder()
                .name(requestDto.getName())
                .description(requestDto.getDescription())
                .build();
        
        Item savedItem = itemRepository.save(item);
        return mapToDto(savedItem);
    }

    @Override
    public ItemResponseDto updateItem(Long id, ItemRequestDto requestDto) {
        log.info("Updating item with id: {}", id);
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        
        item.setName(requestDto.getName());
        item.setDescription(requestDto.getDescription());
        
        Item updatedItem = itemRepository.save(item);
        return mapToDto(updatedItem);
    }

    @Override
    public void deleteItem(Long id) {
        log.info("Deleting item with id: {}", id);
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        
        itemRepository.delete(item);
    }

    private ItemResponseDto mapToDto(Item item) {
        return ItemResponseDto.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .createdAt(item.getCreatedAt())
                .build();
    }
}
