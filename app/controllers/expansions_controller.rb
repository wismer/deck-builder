class ExpansionsController < ApplicationController
  def code
    @expansion = Expansion.find_by(code: params[:code])

    respond_to do |format|
      format.json { render json: @expansion }
    end
  end
end
