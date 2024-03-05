import psutil

# CPU information
cpu_percent = psutil.cpu_percent()
cpu_count = psutil.cpu_count()

print(f"CPU Usage: {cpu_percent}%")
print(f"CPU Count: {cpu_count}")

# Memory information
memory = psutil.virtual_memory()
total_memory = memory.total // (1024 ** 3)  # Convert to GB
available_memory = memory.available // (1024 ** 3)  # Convert to GB

print(f"Total Memory: {total_memory}GB")
print(f"Available Memory: {available_memory}GB")

# Disk information
disk = psutil.disk_usage('/')
total_disk_space = disk.total // (1024 ** 3)  # Convert to GB
used_disk_space = disk.used // (1024 ** 3)  # Convert to GB

print(f"Total Disk Space: {total_disk_space}GB")
print(f"Used Disk Space: {used_disk_space}GB")