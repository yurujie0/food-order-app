import struct

def create_png(width, height, color):
    """创建简单的 PNG 图片"""
    # PNG 文件头
    png_signature = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = 0x575e96f5  # 预计算的 CRC
    ihdr = struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # IDAT chunk (压缩的图像数据)
    # 这里创建一个纯色图片
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'  # 过滤字节
        for x in range(width):
            r, g, b = color
            raw_data += bytes([r, g, b])
    
    # 简单的 deflate 压缩
    import zlib
    compressed = zlib.compress(raw_data)
    idat_crc = zlib.crc32(b'IDAT' + compressed) & 0xffffffff
    idat = struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = 0xae426082  # 预计算的 CRC
    iend = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    return png_signature + ihdr + idat + iend

# 创建橙色图标 (255, 107, 53)
icon_color = (255, 107, 53)
icon_data = create_png(1024, 1024, icon_color)

with open('icon.png', 'wb') as f:
    f.write(icon_data)

with open('adaptive-icon.png', 'wb') as f:
    f.write(icon_data)

with open('splash.png', 'wb') as f:
    f.write(icon_data)

# 创建 favicon
favicon_data = create_png(64, 64, icon_color)
with open('favicon.png', 'wb') as f:
    f.write(favicon_data)

print("图标创建完成！")
