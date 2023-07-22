// custom data type for user record
export interface userData {
	name: String;
	email: String;
}

// custom data type for user query record
export interface userDataQuery {
	id: String;
	name: String;
	email: String;
	created_at: String;
	updated_at: String;
}
