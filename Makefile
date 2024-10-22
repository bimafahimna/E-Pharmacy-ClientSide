dockerup:
	sudo docker compose up $(BUILD) -d

dockerdown:
	sudo docker compose down