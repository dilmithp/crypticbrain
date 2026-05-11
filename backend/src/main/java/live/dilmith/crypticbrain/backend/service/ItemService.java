package live.dilmith.crypticbrain.backend.service;

import live.dilmith.crypticbrain.backend.dto.ItemRequestDto;
import live.dilmith.crypticbrain.backend.dto.ItemResponseDto;

import java.util.List;

public interface ItemService {

    List<ItemResponseDto> getAllItems();

    ItemResponseDto getItemById(Long id);

    ItemResponseDto createItem(ItemRequestDto requestDto);

    ItemResponseDto updateItem(Long id, ItemRequestDto requestDto);

    void deleteItem(Long id);

}
