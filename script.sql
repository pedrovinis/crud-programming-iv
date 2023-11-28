
create database vehiclelesregister;

create table vehicle (
  id int not null primary key,
  model varchar(50) not null,
  automaker varchar(20) not null,
  power varchar(4) not null,
  year varchar(4) not null,
  value varchar(50) not null,
)